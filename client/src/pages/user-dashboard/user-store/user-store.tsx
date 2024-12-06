import React, { createContext, useContext, useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Sun, Moon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Switch } from "@/components/ui/switch"

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
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [darkMode, setDarkMode] = useState(false)
  const { cart, addToCart, removeFromCart, clearCart, getCartTotal } = useShoppingCart()
  const { toast } = useToast()

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
        setError('Failed to fetch products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product =>
    product.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  )

  const handleCheckout = () => {
    toast({
      title: "Checkout initiated",
      description: "Your order has been placed successfully!",
    })
    clearCart()
  }

  if (loading) return <div className="text-center p-8">Loading products...</div>
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.label}</CardTitle>
              <div>{product.category}</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm mb-4">{product.short_description}</p>
              <p className="text-lg font-bold">₱{product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => addToCart({ id: product.id, name: product.label, price: product.price, quantity: 1 })}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredProducts.length === 0 && (
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
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₱{item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => addToCart(item)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="font-bold text-lg">Total: ₱{getCartTotal().toFixed(2)}</p>
                <Button className="w-full mt-4" onClick={handleCheckout}>Checkout</Button>
                <Button variant="outline" className="w-full mt-2" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Toaster />
    </div>
  )
}

// Main Export
export default function Store() {
  return (
    <ShoppingCartProvider>
      <StorePage />
    </ShoppingCartProvider>
  )
}
