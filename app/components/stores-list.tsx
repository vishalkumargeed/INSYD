import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface StoreInventory {
  id: string;
  productId: string;
  initialQuantity: number;
  currentQuantity: number;
  product: {
    id: string;
    name: string;
  };
}

interface Store {
  id: string;
  name: string;
  email: string;
  inventory: StoreInventory[];
}

export function StoresList({ refreshKey }: { refreshKey?: number }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStores() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/Stores/GET", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch stores");
        }
        
        const data = await response.json();
        
        if (data.stores && Array.isArray(data.stores)) {
          setStores(data.stores);
        } else {
          setStores([]);
        }
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError(err instanceof Error ? err.message : "Failed to load stores");
        setStores([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStores();
  }, [refreshKey]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading stores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No stores created yet. Create your first store above!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stores.map((store) => (
        <Card key={store.id}>
          <CardHeader>
            <CardTitle>{store.name}</CardTitle>
            <CardDescription>
              Store Owner: {store.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {store.inventory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No products in inventory yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Initial Quantity</TableHead>
                    <TableHead className="text-right">Current Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {store.inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell className="text-right">{item.initialQuantity}</TableCell>
                      <TableCell className="text-right">{item.currentQuantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
