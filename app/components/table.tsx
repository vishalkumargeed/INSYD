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

interface Product {
  id: string;
  name: string;
  createdAt: string;
}
  
export function ProdcutsTable({ refreshKey }: { refreshKey?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/Products/GET", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        console.log("data is:", data);
        
        // The API returns { products: [...] }, so we need to extract the array
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, [refreshKey]); 

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Loading products...
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
      <TableCaption>A list of all available products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead className="text-right">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500 dark:text-gray-400 py-8">
              No products found. Add your first product above!
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.id.slice(0, 8)}...</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-right text-sm text-gray-500 dark:text-gray-400">
                {new Date(product.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="font-medium">Total Products</TableCell>
          <TableCell className="text-right font-medium">{products.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
  