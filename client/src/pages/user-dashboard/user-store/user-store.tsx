import React, { createContext, useContext, useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { useUserContext } from '@/hooks/use-user'

// Shopping Cart Context
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface ShoppingCartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined)

const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext)
  if (!context) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider')
  }
  return context
}

const ShoppingCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        toast({
          title: "Item quantity updated",
          description: `${item.name} quantity increased to ${existingItem.quantity + 1}`,
        })
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      }
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart`,
      })
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id)
      if (existingItem && existingItem.quantity > 1) {
        toast({
          title: "Item quantity updated",
          description: `${existingItem.name} quantity decreased to ${existingItem.quantity - 1}`,
        })
        return prevCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
      toast({
        title: "Item removed from cart",
        description: `${existingItem?.name} has been removed from your cart`,
      })
      return prevCart.filter(item => item.id !== id)
    })
  }

  const clearCart = () => {
    setCart([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <ShoppingCartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </ShoppingCartContext.Provider>
  )
}

// Store Page Component
interface Product {
  id: number
  name: string
  label: string
  short_description: string
  payment_type: string
  price: number
  status: number
  the_order: number
  created_at: number
  category: string
}

const categories = ['All', 'ATM', 'NETTV', 'WiFi']

function StorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useShoppingCart()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState('')

  const { user } = useUserContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          const mockProducts: Product[] = [
            {
              id: 1,
              name: "XPRESS_ATM_WITHDRAWAL_BUSINESS",
              label: "XPRESS ATM WITHDRAWAL BUSINESS",
              short_description: "Convenient ATM withdrawal service for businesses",
              payment_type: "payment",
              price: 5998.00,
              status: 0,
              the_order: 0,
              created_at: 1731660918,
              category: 'ATM'
            },
            {
              id: 2,
              name: "XPRESS_ATM_WITHDRAWAL_BUSINESS",
              label: "XPRESS ATM WITHDRAWAL BUSINESS (Premium)",
              short_description: "Premium ATM withdrawal service with additional features",
              payment_type: "payment",
              price: 7998.00,
              status: 0,
              the_order: 0,
              created_at: 1731660918,
              category: 'ATM'
            },
            {
              id: 4,
              name: "Xpress_NETTV_Negosyo_Package",
              label: "Xpress NETTV Negosyo Package",
              short_description: "Comprehensive NETTV package for businesses",
              payment_type: "payment",
              price: 5998.00,
              status: 0,
              the_order: 0,
              created_at: 1731909110,
              category: 'NETTV'
            },
            {
              id: 3,
              name: "Xpress_WiFi_Zone_Negosyo_Package",
              label: "Xpress Wi-Fi Zone Negosyo Package",
              short_description: "High-speed WiFi solution for business areas",
              payment_type: "payment",
              price: 5998.00,
              status: 0,
              the_order: 0,
              created_at: 1731908052,
              category: 'WiFi'
            }
          ]
          setProducts(mockProducts)
          setLoading(false)
        }, 1000)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch products. Please try again later.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  const filteredProducts = products.filter(product =>
    product.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  )

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Checkout failed",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Checkout failed",
        description: "Please select a payment method.",
        variant: "destructive",
      });
      return;
    }

    const packages = cart.map((item) => ({
      packageName: item.name,
      amount: item.price,
    }));

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-invitation-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packages, user_id: user.id, paymentMethod }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Checkout successful",
          description: `Invitation codes created successfully. Payment method: ${paymentMethod}`,
        });
        clearCart();
        setPaymentMethod('');
      } else {
        toast({
          title: "Checkout failed",
          description: data.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Our Products</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="category">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-300 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))
        ) : filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-lg">{product.label}</CardTitle>
              <div className="text-sm text-muted-foreground">{product.category}</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm mb-4">{product.short_description}</p>
              <p className="text-lg font-bold">₱{product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => addToCart({ id: product.id, name: product.label, price: product.price, quantity: 1 })}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredProducts.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-8">No products found.</p>
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 z-10">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="mt-6">
              <p className="text-right font-bold text-xl mb-4">
                Total: ₱{getCartTotal().toFixed(2)}
              </p>
              <div className="mb-4">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="credits">Credits</SelectItem>
                    <SelectItem value="gcash">GCASH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCheckout} disabled={!paymentMethod}>
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <ShoppingCartProvider>
      <StorePage />
    </ShoppingCartProvider>
  )
}

