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
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"

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
  const [decreaseQuantities, setDecreaseQuantities] = useState<Record<string, string>>({});

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

    const quantityToDecrease = parseInt(decreaseQuantities[inventoryId] || "1");
    
    if (!quantityToDecrease || quantityToDecrease <= 0) {
      alert("Please enter a valid quantity to decrease");
      return;
    }

    if (quantityToDecrease > currentQty) {
      alert("Cannot decrease more than current quantity");
      return;
    }

    setDecreasingId(inventoryId);
    try {
      const response = await fetch("/api/Stores/inventory/decrease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId, quantity: quantityToDecrease }),
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
      setDecreaseQuantities(prev => {
        const updated = { ...prev };
        delete updated[inventoryId];
        return updated;
      });
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      alert(err instanceof Error ? err.message : "Failed to decrease quantity");
    } finally {
      setDecreasingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <Loader size="md" />
        <p className="text-muted-foreground font-base">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 p-4 rounded-base border-2 border-destructive bg-destructive/20 text-destructive-foreground font-base">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-2 sm:px-0">
        <Table>
          <TableCaption>A list of products in your store inventory.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-left sm:text-right">Initial Qty</TableHead>
              <TableHead className="text-left sm:text-right">Current Qty</TableHead>
              <TableHead className="text-left sm:text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
      <TableBody>
        {inventory.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground py-12 font-base">
              No products in inventory. Add products above!
            </TableCell>
          </TableRow>
        ) : (
          inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.product.name}</TableCell>
              <TableCell className="text-left sm:text-right">{item.initialQuantity}</TableCell>
              <TableCell className="text-left sm:text-right">{item.currentQuantity}</TableCell>
              <TableCell className="text-left sm:text-right">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-end">
                  <Input
                    type="number"
                    min="1"
                    max={item.currentQuantity}
                    value={decreaseQuantities[item.id] || ""}
                    onChange={(e) => setDecreaseQuantities(prev => ({
                      ...prev,
                      [item.id]: e.target.value
                    }))}
                    placeholder="Qty"
                    className="w-full sm:w-20"
                    disabled={decreasingId === item.id || item.currentQuantity <= 0}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decreaseQuantity(item.id, item.currentQuantity)}
                    disabled={decreasingId === item.id || item.currentQuantity <= 0}
                    className="w-full sm:w-auto"
                  >
                    {decreasingId === item.id ? 'Decreasing...' : 'Decrease'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="font-medium">Total Products</TableCell>
          <TableCell className="text-left sm:text-right font-medium">{inventory.length}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
      </div>
    </div>
  );
}
