'use client'
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { ProductsTable } from "../components/table";
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
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

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
  const [productMessage, setProductMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [storeMessage, setStoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [inventoryMessage, setInventoryMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
      setProductMessage({ type: 'error', text: 'Please enter a product name' });
      return;
    }

    setIsLoading(true);
    setProductMessage(null);

    try {
      const response = await fetch("/api/Products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: productName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage({ type: 'success', text: data.message || 'Product added successfully!' });
        setProductName("");
        setRefreshKey(prev => prev + 1);
        const productsResponse = await fetch("/api/Products/GET");
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.products || []);
        }
      } else {
        setProductMessage({ type: 'error', text: data.message || 'Failed to add product' });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setProductMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  async function createStore() {
    if (!storeName.trim()) {
      setStoreMessage({ type: 'error', text: 'Please enter a store name' });
      return;
    }

    if (!storeOwnerEmail.trim()) {
      setStoreMessage({ type: 'error', text: 'Please enter store owner email' });
      return;
    }

    setIsLoading(true);
    setStoreMessage(null);

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
        setStoreMessage({ type: 'success', text: data.message || 'Store created successfully!' });
        setStoreName("");
        setStoreOwnerEmail("");
        setRefreshKey(prev => prev + 1);
      } else {
        setStoreMessage({ type: 'error', text: data.message || 'Failed to create store' });
      }
    } catch (error) {
      console.error("Error creating store:", error);
      setStoreMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  async function addToInventory() {
    if (!selectedProductId) {
      setInventoryMessage({ type: 'error', text: 'Please select a product' });
      return;
    }

    if (!productQuantity || parseInt(productQuantity) <= 0) {
      setInventoryMessage({ type: 'error', text: 'Please enter a valid quantity' });
      return;
    }

    setIsLoading(true);
    setInventoryMessage(null);

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
        setInventoryMessage({ type: 'success', text: data.message || 'Product added to inventory successfully!' });
        setSelectedProductId("");
        setProductQuantity("");
        setRefreshKey(prev => prev + 1);
      } else {
        setInventoryMessage({ type: 'error', text: data.message || 'Failed to add product to inventory' });
      }
    } catch (error) {
      console.error("Error adding to inventory:", error);
      setInventoryMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  if (userRole === null) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size="lg" />
          <p className="text-muted-foreground font-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-foreground">
              Welcome, {session?.user?.name}
            </h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base font-base">
              {userRole === "manufacturer" ? "Manage your products and stores" : "Manage your store inventory"}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
        </div>

        {userRole === "manufacturer" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
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
                    <Input
                      id="store-name"
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Enter store name..."
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-owner-email">Store Owner Email</Label>
                    <Input
                      id="store-owner-email"
                      type="email"
                      value={storeOwnerEmail}
                      onChange={(e) => setStoreOwnerEmail(e.target.value)}
                      placeholder="Enter store owner email..."
                      disabled={isLoading}
                    />
                  </div>
                  {storeMessage && (
                    <div
                      className={`p-4 rounded-base border-2 border-border shadow-shadow text-sm font-base ${
                        storeMessage.type === 'success'
                          ? 'bg-chart-1/20 text-foreground border-chart-1'
                          : 'bg-destructive/20 text-destructive-foreground border-destructive'
                      }`}
                    >
                      {storeMessage.text}
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

              <Card>
                <CardHeader>
                  <CardTitle>Add New Product</CardTitle>
                  <CardDescription>
                    Enter the name of the product you want to add
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
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
                      disabled={isLoading}
                    />
                  </div>
                  {productMessage && (
                    <div
                      className={`p-4 rounded-base border-2 border-border shadow-shadow text-sm font-base ${
                        productMessage.type === 'success'
                          ? 'bg-chart-1/20 text-foreground border-chart-1'
                          : 'bg-destructive/20 text-destructive-foreground border-destructive'
                      }`}
                    >
                      {productMessage.text}
                    </div>
                  )}
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

            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    List of all available products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductsTable refreshKey={refreshKey} />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      className="w-full h-10 px-3 py-2 border-2 border-border rounded-base bg-background text-foreground font-base shadow-shadow focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
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
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      placeholder="Enter quantity..."
                      disabled={isLoading}
                    />
                  </div>
                  {inventoryMessage && (
                    <div
                      className={`p-4 rounded-base border-2 border-border shadow-shadow text-sm font-base ${
                        inventoryMessage.type === 'success'
                          ? 'bg-chart-1/20 text-foreground border-chart-1'
                          : 'bg-destructive/20 text-destructive-foreground border-destructive'
                      }`}
                    >
                      {inventoryMessage.text}
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