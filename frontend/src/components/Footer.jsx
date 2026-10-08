import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [policy, setPolicy] = useState("");

  const linkStyle =
    "text-xs text-slate-400 hover:text-white transition-colors";

  return (
    <>
      <footer className="bg-slate-950 border-t border-slate-800 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">

          <div className="text-center md:text-left">
            <div className="text-white font-extrabold text-sm">
              YASSH
              <span className="ml-2 text-[9px] tracking-[3px] text-slate-500">
                ENTERPRISES
              </span>
            </div>

            <p className="text-[10px] text-slate-500 mt-2">
              © {new Date().getFullYear()} YASSH ENTERPRISES. All Rights Reserved.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <Link to="/products" className={linkStyle}>
              Products
            </Link>

            <Link to="/contact" className={linkStyle}>
              Contact
            </Link>

            <button onClick={() => setPolicy("privacy")} className={linkStyle}>
              Privacy Policy
            </button>

            <button onClick={() => setPolicy("terms")} className={linkStyle}>
              Terms of Service
            </button>
          </nav>
        </div>
      </footer>

      {policy && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">

            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {policy === "privacy"
                    ? "Privacy Policy"
                    : "Terms of Service"}
                </h2>

                <p className="text-[10px] text-slate-500 mt-1">
                  Yassh Enterprises · Last updated October 2026
                </p>
              </div>

              <button
                onClick={() => setPolicy("")}
                className="text-2xl text-slate-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto p-6 text-sm text-slate-400 leading-7">
              {policy === "privacy" ? (
                <p>
                  Yassh Enterprises respects the privacy of its customers and
                  may collect information such as name, phone number, email
                  address, delivery details, account information, order details,
                  and product customization requirements when customers use the
                  website. This information is used to create customer accounts,
                  respond to enquiries, process and manage orders, discuss
                  customized products, arrange delivery, provide customer
                  support, and improve our services. Customer information is not
                  intended to be sold to third parties and may only be shared
                  when necessary for order fulfilment, delivery, website
                  operations, or legal requirements. Reasonable measures are
                  taken to protect customer information, although no online
                  system can guarantee complete security. Yassh Enterprises may
                  update this Privacy Policy when necessary, and customers may
                  contact us through the website for privacy-related questions
                  or requests.
                </p>
              ) : (
                <p>
                  By using the Yassh Enterprises website, customers agree to use
                  the website lawfully and provide accurate information when
                  registering, submitting enquiries, or placing orders. Product
                  specifications, prices, availability, and other details may
                  change, and customized products may require direct discussion
                  and confirmation before fabrication. Submitting an enquiry or
                  order request does not automatically constitute final
                  confirmation; Yassh Enterprises may contact the customer to
                  confirm product requirements, pricing, delivery details, and
                  payment arrangements. Delivery time may vary depending on the
                  product, quantity, customization, and customer location.
                  Website content, including text, images, branding, and other
                  original materials, belongs to Yassh Enterprises and should
                  not be copied or used without permission. These terms may be
                  updated when required, and customers can contact Yassh
                  Enterprises through the website for questions regarding
                  products, orders, or these Terms of Service.
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Footer;