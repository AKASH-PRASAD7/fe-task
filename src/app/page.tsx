import Navbar from "@/components/navbar";
import Table from "@/components/table";

export async function generateMetadata() {
  return {
    title: "All Products – Vivid Cart",
    description:
      "Welcome to Vivid Cart, your one-stop shop for all things vibrant and stylish.",
  };
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-auto">
      <Navbar />
      <Table />
    </main>
  );
}
