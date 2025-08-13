import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-10 px-4 lg:w-[76%]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Useful Links */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Useful Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/about" className="hover:text-green-600">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-green-600">FAQs</Link></li>
              <li><Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-green-600">Terms & Conditions</Link></li>
              <li><Link href="/contact" className="hover:text-green-600">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/category/vegetable" className="hover:text-green-600">Vegetables</Link></li>
              <li><Link href="/category/fruit" className="hover:text-green-600">Fruits</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} VeggieKart Commerce Private Limited. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};