'use client'
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ProdcutsTable } from "../components/table";
import { InventoryTable } from "../components/inventory-table";
import { StoresList } from "../components/stores-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeOwnerEmail, setStoreOwnerEmail] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch("/api/user/current");
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUserRole(data.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }
    fetchUserRole();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/Products/GET");
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  async function addProduct() {
    if (!productName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a product name' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/Products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: productName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.messaGE || data.message || 'Product added successfully!' });
        setProductName("");
        setRefreshKey(prev => prev + 1);
        const productsResponse = await fetch("/api/Products/GET");
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.products || []);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add product' });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  async function createStore() {
    if (!storeName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a store name' });
      return;
    }

    if (!storeOwnerEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter store owner email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/Stores/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: storeName.trim(),
          email: storeOwnerEmail.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Store created successfully!' });
        setStoreName("");
        setStoreOwnerEmail("");
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create store' });
      }
    } catch (error) {
      console.error("Error creating store:", error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  async function addToInventory() {
    if (!selectedProductId) {
      setMessage({ type: 'error', text: 'Please select a product' });
      return;
    }

    if (!productQuantity || parseInt(productQuantity) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid quantity' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/Stores/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: selectedProductId,
          quantity: parseInt(productQuantity)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Product added to inventory successfully!' });
        setSelectedProductId("");
        setProductQuantity("");
        setRefreshKey(prev => prev + 1);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add product to inventory' });
      }
    } catch (error) {
      console.error("Error adding to inventory:", error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  if (userRole === null) {
    return (
      <div className="min-h-screen from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {session?.user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {userRole === "manufacturer" ? "Manage your products and stores" : "Manage your store inventory"}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </div>

        {userRole === "manufacturer" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Create Store</CardTitle>
                  <CardDescription>
                    Create a new store and assign a store owner
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <input
                      id="store-name"
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Enter store name..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-owner-email">Store Owner Email</Label>
                    <input
                      id="store-owner-email"
                      type="email"
                      value={storeOwnerEmail}
                      onChange={(e) => setStoreOwnerEmail(e.target.value)}
                      placeholder="Enter store owner email..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  {message && (
                    <div
                      className={`p-3 rounded-md text-sm ${
                        message.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={createStore}
                    disabled={isLoading || !storeName.trim() || !storeOwnerEmail.trim()}
                  >
                    {isLoading ? 'Creating...' : 'Create Store'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>
                    Enter the name of the product you want to add
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <input
                      id="product-name"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                          addProduct();
                        }
                      }}
                      placeholder="Enter product name..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={addProduct}
                    disabled={isLoading || !productName.trim()}
                  >
                    {isLoading ? 'Adding...' : 'Add Product'}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    List of all available products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProdcutsTable refreshKey={refreshKey} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stores & Inventory</CardTitle>
                  <CardDescription>
                    View all stores and their inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StoresList refreshKey={refreshKey} />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Add Product to Inventory</CardTitle>
                  <CardDescription>
                    Select a product and add it to your store inventory
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-select">Product</Label>
                    <select
                      id="product-select"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      placeholder="Enter quantity..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  </div>
                  {message && (
                    <div
                      className={`p-3 rounded-md text-sm ${
                        message.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={addToInventory}
                    disabled={isLoading || !selectedProductId || !productQuantity || parseInt(productQuantity) <= 0}
                  >
                    {isLoading ? 'Adding...' : 'Add to Inventory'}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Store Inventory</CardTitle>
                  <CardDescription>
                    View and manage your store inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryTable refreshKey={refreshKey} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}