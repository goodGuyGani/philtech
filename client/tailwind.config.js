/** @type {import('tailwindcss').Config} */
module.exports = {
	// Enable dark mode with the "class" strategy
	darkMode: ["class"],
  
	// Specify the files Tailwind should scan for class names
	content: [
	  "./pages/**/*.{ts,tsx}",    // Include TypeScript pages
	  "./components/**/*.{ts,tsx}", // Include TypeScript components
	  "./app/**/*.{ts,tsx}",      // Include TypeScript app folder
	  "./src/**/*.{ts,tsx}",      // Include TypeScript src folder
	],
  
	// Add a prefix to avoid class name conflicts (empty by default)
	prefix: "",
  
	// Configure theme settings
	theme: {
	  // Default container configuration
	  container: {
		center: true, // Center-align container
		padding: "2rem", // Default padding
		screens: {
		  "2xl": "1400px", // Define max width for large screens
		},
	  },
  
	  // Extend the default theme
	  extend: {
		// Add custom colors with CSS variable support
		colors: {
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		},
  
		// Add custom border radius sizes
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
  
		// Add custom animations and keyframes
		keyframes: {
		  "accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
  
	// Include plugins
	plugins: [
	  require("tailwindcss-animate"), // Tailwind plugin for animations
	],
  };
  