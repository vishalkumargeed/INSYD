import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface InventoryItem {
  id: string;
  productId: string;
  initialQuantity: number;
  currentQuantity: number;
  product: {
    id: string;
    name: string;
  };
}

export function InventoryTable({ refreshKey }: { refreshKey?: number }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decreasingId, setDecreasingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/Stores/inventory/GET", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch inventory");
        }
        
        const data = await response.json();
        
        if (data.inventory && Array.isArray(data.inventory)) {
          setInventory(data.inventory);
        } else {
          setInventory([]);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(err instanceof Error ? err.message : "Failed to load inventory");
        setInventory([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInventory();
  }, [refreshKey]);

  async function decreaseQuantity(inventoryId: string, currentQty: number) {
    if (currentQty <= 0) {
      return;
    }

    setDecreasingId(inventoryId);
    try {
      const response = await fetch("/api/Stores/inventory/decrease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId, quantity: 1 }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to decrease quantity");
      }

      const data = await response.json();
      setInventory(prev => prev.map(item => 
        item.id === inventoryId 
          ? { ...item, currentQuantity: data.inventory.currentQuantity }
          : item
      ));
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      alert(err instanceof Error ? err.message : "Failed to decrease quantity");
    } finally {
      setDecreasingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading inventory...
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

  return (
    <Table>
      <TableCaption>A list of products in your store inventory.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead className="text-right">Initial Quantity</TableHead>
          <TableHead className="text-right">Current Quantity</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-gray-500 dark:text-gray-400 py-8">
              No products in inventory. Add products above!
            </TableCell>
          </TableRow>
        ) : (
          inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.product.name}</TableCell>
              <TableCell className="text-right">{item.initialQuantity}</TableCell>
              <TableCell className="text-right">{item.currentQuantity}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => decreaseQuantity(item.id, item.currentQuantity)}
                  disabled={decreasingId === item.id || item.currentQuantity <= 0}
                >
                  {decreasingId === item.id ? 'Decreasing...' : 'Decrease'}
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="font-medium">Total Products</TableCell>
          <TableCell className="text-right font-medium">{inventory.length}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
