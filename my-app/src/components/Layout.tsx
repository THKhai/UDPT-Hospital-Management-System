import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />
      <main className="flex-grow pt-8 pb-20">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;