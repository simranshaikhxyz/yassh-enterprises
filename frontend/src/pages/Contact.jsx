import React from "react";

function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans py-8 sm:py-10 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-9 sm:mb-12 lg:mb-14">
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            Let's Connect
          </h1>

          <p className="text-slate-500 text-sm sm:text-base mt-3 sm:mt-4 leading-relaxed px-1">
            Connect directly with Yassh Enterprises in Mumbai for precision
            sheet bending, custom fabrication inquiries, and fast site
            measurement bookings.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-8 items-stretch mb-8 sm:mb-12">

          {/* Contact Details */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 flex flex-col justify-between shadow-sm">

            <div>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest text-indigo-600 uppercase font-semibold">
                Headquarters
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 mt-1 mb-6 sm:mb-8 tracking-tight">
                YASSH ENTERPRISES
              </h2>

              <div className="space-y-5 sm:space-y-6">

                {/* Phone */}
                <div className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-950 group-hover:text-white transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1.3 1.3 0 01-.321.988l-1.305 1.4c-.736.788-.647 2.018.145 2.761 1.054.95 2.233 1.777 3.52 2.454.78.41 1.714.28 2.28-.466l.947-1.02a1.3 1.3 0 011.096-.347l2.2.553a1 1 0 01.724.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                      Phone Support
                    </h4>

                    <a
                      href="tel:8689846099"
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 block mt-0.5 transition-colors duration-200"
                    >
                      +91 86898 46099
                    </a>

                    <span className="text-[11px] sm:text-xs text-slate-500">
                      Mon - Sat, 9:00 AM - 7:00 PM
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-950 group-hover:text-white transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </h4>

                    <a
                      href="mailto:baayassh@gmail.com"
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 block mt-0.5 transition-colors duration-200 break-all"
                    >
                      baayassh@gmail.com
                    </a>

                    <span className="text-[11px] sm:text-xs text-slate-500">
                      Online inquiries answered within 24 hours
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-slate-950 group-hover:text-white transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                      Factory Address
                    </h4>

                    <p className="text-slate-900 text-xs sm:text-sm font-bold mt-1 leading-relaxed">
                      Jogeshwari East, <br />
                      Mumbai, Maharashtra - 400060
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Button */}
            <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-slate-100">
              <a
                href="https://maps.google.com/?q=Jogeshwari+East+Mumbai"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-950 text-slate-900 hover:text-white border border-slate-200 text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl shadow-sm transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>

                Open Direction in Google Maps
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-slate-100 relative h-[320px] sm:h-[400px] lg:h-auto lg:min-h-[500px]">
            <iframe
              title="YASSH ENTERPRISES Location Map"
              src="https://www.google.com/maps?q=Jogeshwari%20East%20Mumbai&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              className="border-0 w-full h-full absolute inset-0"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;