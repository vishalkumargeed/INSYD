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
import { Loader } from "@/components/ui/loader";

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
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <Loader size="md" />
        <p className="text-muted-foreground font-base">Loading stores...</p>
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

  if (stores.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground font-base">
        No stores created yet. Create your first store above!
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {stores.map((store) => (
        <Card key={store.id}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">{store.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm break-all">
              Store Owner: {store.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {store.inventory.length === 0 ? (
              <p className="text-muted-foreground text-sm font-base">
                No products in inventory yet.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-2 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-left sm:text-right">Initial Qty</TableHead>
                          <TableHead className="text-left sm:text-right">Current Qty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {store.inventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.product.name}</TableCell>
                            <TableCell className="text-left sm:text-right">{item.initialQuantity}</TableCell>
                            <TableCell className="text-left sm:text-right">{item.currentQuantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {(() => {
                    const fastConsuming = store.inventory.filter(item => {
                      const usagePercent = (item.initialQuantity - item.currentQuantity) / item.initialQuantity;
                      return usagePercent > 0.5;
                    });

                    const overstocked = store.inventory.filter(item => {
                      const remainingPercent = item.currentQuantity / item.initialQuantity;
                      return remainingPercent > 0.8;
                    });

                    const mediumFlow = store.inventory.filter(item => {
                      const usagePercent = (item.initialQuantity - item.currentQuantity) / item.initialQuantity;
                      const remainingPercent = item.currentQuantity / item.initialQuantity;
                      return usagePercent <= 0.5 && remainingPercent <= 0.8;
                    });

                    return (
                      <>
                        {fastConsuming.length > 0 && (
                          <div className="border-2 border-destructive bg-destructive/20 p-3 sm:p-4 rounded-base shadow-shadow">
                            <h4 className="font-heading text-destructive-foreground mb-2 text-sm sm:text-base">Fast Consuming Items</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-foreground font-base">
                              {fastConsuming.map(item => (
                                <li key={item.id} className="break-words">
                                  {item.product.name} - {item.currentQuantity}/{item.initialQuantity} remaining
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {overstocked.length > 0 && (
                          <div className="border-2 border-chart-4 bg-chart-4/20 p-3 sm:p-4 rounded-base shadow-shadow">
                            <h4 className="font-heading text-foreground mb-2 text-sm sm:text-base">Overstocked Items</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-foreground font-base">
                              {overstocked.map(item => (
                                <li key={item.id} className="break-words">
                                  {item.product.name} - {item.currentQuantity}/{item.initialQuantity} remaining
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {mediumFlow.length > 0 && (
                          <div className="border-2 border-chart-2 bg-chart-2/20 p-3 sm:p-4 rounded-base shadow-shadow">
                            <h4 className="font-heading text-foreground mb-2 text-sm sm:text-base">Medium Flow Items</h4>
                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-foreground font-base">
                              {mediumFlow.map(item => (
                                <li key={item.id} className="break-words">
                                  {item.product.name} - {item.currentQuantity}/{item.initialQuantity} remaining
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
