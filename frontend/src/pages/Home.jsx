import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Reveal from "../components/Reveal";

function Home() {
  const [activeWork, setActiveWork] = useState(0);

  const features = [
    [
      "01",
      "Exact Material Specs",
      "Choose your required sheet thickness, metal type, finish, color and dimensions.",
    ],
    [
      "02",
      "Custom Fabrication",
      "From storage boxes to custom enclosures, products can be made around your requirements.",
    ],
    [
      "03",
      "Small & Bulk Orders",
      "We handle individual requirements as well as larger orders for businesses and industries.",
    ],
    [
      "04",
      "Reliable Execution",
      "Practical metal solutions built with durability and real-world usage in mind.",
    ],
  ];

  const workShowcase = [
    {
      id: "01",
      title: "Industrial Steel Rolls",
      category: "Workshop Floor",
      description:
        "High-quality steel coils are stored and handled in our workshop, providing a reliable supply of raw material for precision fabrication and sheet metal work.",
      image:
        "https://res.cloudinary.com/cnxvqb67/image/upload/v1789633355/premium_photo-1682144783087-fe52612b1f0d.avif",
      highlight: "Heavy-duty steel inventory",
    },
    {
      id: "02",
      title: "Precision Measurement",
      category: "Fabrication Workshop",
      description:
        "Accurate measurements and careful marking are carried out by skilled craftsmen to ensure every metal component is prepared to the required dimensions.",
      image:
        "https://res.cloudinary.com/cnxvqb67/image/upload/v1789633199/1st.png",
      highlight: "Accurate hand measurement",
    },
    {
      id: "03",
      title: "Sheet Metal Processing",
      category: "Production Line",
      description:
        "Large metal sheets are processed and prepared for fabrication using industrial equipment, ensuring clean surfaces and consistent results across every project.",
      image:
        "https://res.cloudinary.com/cnxvqb67/image/upload/v1789633292/G60-Galvanized-Steel-Sheets-in-Factory-Production.webp",
      highlight: "Industrial sheet processing",
    },
    {
      id: "04",
      title: "Metal Storage & Finishing",
      category: "Quality Control",
      description:
        "Organized metal storage drawers keep components and materials securely arranged, supporting efficient handling, finishing, and quality inspection throughout production.",
      image:
        "https://res.cloudinary.com/cnxvqb67/image/upload/v1789633313/2nd.png",
      highlight: "Organized component storage",
    },
    {
      id: "05",
      title: "Custom Metal Boxes",
      category: "Custom Assembly",
      description:
        "Durable metal boxes and enclosures are fabricated for industrial and utility applications, with practical designs suited to different storage and protection requirements.",
      image:
        "https://res.cloudinary.com/cnxvqb67/image/upload/v1789640848/andrew-sharp--d271vR-S5U-unsplash.jpg",
      highlight: "Durable custom enclosures",
    },
    {
      id: "06",
      title: "Storage & Dispatch Bins",
      category: "Logistics Hub",
      description:
        "Modular storage bins provide an organized solution for keeping components and finished materials accessible, protected, and ready for handling or dispatch.",
      image:
        "https://res.cloudinary.com/cnxvqb67/image/upload/v1789641128/86866218-7a06-4b91-8139-d069f9cdcff7.png",
      highlight: "Organized storage & handling",
    },
  ];

  const process = [
    [
      "01",
      "Share Your Requirement",
      "Tell us your required dimensions, material, quantity, finish, and application. We understand your needs before starting the work.",
      "→",
    ],
    [
      "02",
      "Precision Fabrication",
      "Our team fabricates your product according to the agreed specifications, with attention to accuracy, finish, and practical requirements.",
      "→",
    ],
    [
      "03",
      "Quality & Delivery",
      "Every finished product is checked for quality and prepared carefully for safe delivery or collection.",
      "✓",
    ],
  ];

  /* =========================================================
     AUTOMATIC WORK SHOWCASE
  ========================================================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWork((prev) => (prev + 1) % workShowcase.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [workShowcase.length]);

  /* =========================================================
     WORK SHOWCASE GRID
  ========================================================= */
  const getVisibleGridItems = () => {
    let startIndex = activeWork - 1;

    if (startIndex < 0) {
      startIndex = workShowcase.length - 1;
    }

    const items = [];

    for (let i = 0; i < 4; i++) {
      const index = (startIndex + i) % workShowcase.length;

      items.push({
        ...workShowcase[index],
        originalIndex: index,
      });
    }

    return items;
  };

  const visibleGridItems = getVisibleGridItems();

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-slate-950">

        <img
          src="https://res.cloudinary.com/cnxvqb67/image/upload/v1789633355/premium_photo-1682144783087-fe52612b1f0d.avif"
          alt="Yassh Enterprises metal fabrication"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 mb-5">

              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />

              <span className="text-indigo-300 text-[9px] sm:text-xs font-bold uppercase tracking-[0.15em]">
                From Family Legacy to Modern Fabrication
              </span>

            </div>

            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tight">
              Crafted <span className="text-indigo-400">Metal.</span>
              <br />
              <span className="text-indigo-400">Built</span> to Last.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-7 mt-6">
              Custom metal boxes, storage solutions and sheet-metal fabrication
              for businesses, workshops and industrial requirements.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">

              <Link
                to="/products"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition"
              >
                Browse Products →
              </Link>

              <Link
                to="/contact"
                className="flex items-center justify-center border border-white/25 bg-white/5 hover:bg-white/10 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition"
              >
                Request Custom Work
              </Link>

            </div>

          </div>
        </div>

        {/* HERO STATS */}
        <div className="relative z-20 border-t border-white/10 bg-slate-950/95">

          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">

            {[
              ["26+", "Years Legacy"],
              ["CUSTOM", "Fabrication"],
              ["SMALL", "To Bulk Orders"],
              ["PUNE", "Industrial Hub"],
            ].map(([value, label]) => (

              <div
                key={label}
                className="px-4 sm:px-6 py-4 sm:py-5 border-r border-white/10 last:border-r-0"
              >

                <p className="text-indigo-400 text-lg sm:text-2xl font-black">
                  {value}
                </p>

                <p className="text-slate-400 text-[8px] sm:text-[9px] uppercase tracking-[0.15em] mt-1">
                  {label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          WHY YASSH ENTERPRISES
      ========================================================= */}
      <Reveal>
        <section className="bg-white pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 lg:pb-10">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

            <SectionHeading
              label="Why Yassh Enterprises"
              title={
                <>
                  Metal Work Built Around
                  <span className="text-indigo-600">
                    {" "}Your Requirement
                  </span>
                </>
              }
              text="Combining family experience in metal craftsmanship with practical fabrication and convenient online ordering."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

              {features.map(([number, title, text]) => (

                <div
                  key={number}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                >

                  <div className="flex justify-between">

                    <span className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                      {number}
                    </span>

                    <span className="text-slate-300 group-hover:text-indigo-300 text-2xl font-black">
                      +
                    </span>

                  </div>

                  <h3 className="text-lg font-bold mt-6">
                    {title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-6 mt-3">
                    {text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>
      </Reveal>


      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <Reveal>
        <section className="bg-slate-50 pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 lg:pb-20">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* IMAGE */}
              <div className="relative">

                <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">

                  <img
                    src="https://res.cloudinary.com/cnxvqb67/image/upload/v1789466619/WhatsApp_Image_2026-09-15_at_1.32.54_PM.jpg"
                    alt="Earlier generation of our family working with metal"
                    className="w-full h-[350px] sm:h-[450px] object-cover"
                  />

                </div>

                
              </div>

              {/* STORY */}
              <div>

                <span className="text-indigo-600 text-sm sm:text-base font-bold uppercase tracking-[0.25em]">
                  Our Story
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4 leading-tight">
                  A Family Legacy of
                  <span className="text-indigo-600">
                    {" "}Metal Craftsmanship
                  </span>
                </h2>

                {/* PARAGRAPH 1 */}
                <p className="text-slate-500 text-sm sm:text-base leading-7 mt-5">
                  Yassh Enterprises carries forward a family legacy of metalwork, built on hard work, craftsmanship, and hands-on experience.
                  The photograph takes us back to an earlier generation of our family, when our grandfather’s generation worked with simple tools, skilled hands, and a strong commitment to quality workmanship.
                </p>

                {/* PARAGRAPH 2 */}
                <p className="text-slate-500 text-sm sm:text-base leading-7 mt-4">
                  Over the years, this experience and knowledge were passed from
                  one generation to the next. While the tools, techniques, and
                  requirements have changed, the values of honest work, attention
                  to detail, and customer trust have remained the same.
                </p>

                {/* PARAGRAPH 3 */}
                <p className="text-slate-500 text-sm sm:text-base leading-7 mt-4">
                  With 26+ years of experience, Yashh Enterprises continues this
                  journey through custom metal fabrication and practical
                  solutions for businesses, workshops, and industrial
                  requirements. Every project is approached with care, from
                  choosing the right material and dimensions to achieving the
                  required finish.
                </p>

                {/* HIGHLIGHTS */}
                <div className="flex flex-wrap gap-3 mt-7">

                  <div className="px-4 py-3 rounded-xl bg-white border border-slate-200">

                    <p className="text-indigo-600 font-black text-lg">
                      26+
                    </p>

                    <p className="text-slate-500 text-xs uppercase tracking-wider">
                      Years Legacy
                    </p>

                  </div>

                  <div className="px-4 py-3 rounded-xl bg-white border border-slate-200">

                    <p className="text-indigo-600 font-black text-lg">
                      Family
                    </p>

                    <p className="text-slate-500 text-xs uppercase tracking-wider">
                      Legacy
                    </p>

                  </div>

                  <div className="px-4 py-3 rounded-xl bg-white border border-slate-200">

                    <p className="text-indigo-600 font-black text-lg">
                      Custom
                    </p>

                    <p className="text-slate-500 text-xs uppercase tracking-wider">
                      Fabrication
                    </p>

                  </div>

                  <div className="px-4 py-3 rounded-xl bg-white border border-slate-200">

                    <p className="text-indigo-600 font-black text-lg">
                      Quality
                    </p>

                    <p className="text-slate-500 text-xs uppercase tracking-wider">
                      Focused
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      </Reveal>


      {/* =========================================================
          EXPLORE OUR WORK
      ========================================================= */}
      <Reveal>
        <section className="bg-slate-950 py-10 sm:py-14 lg:py-16 text-white relative overflow-hidden">

          {/* BACKGROUND IMAGE */}
          {workShowcase.map((item, index) => (

            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out pointer-events-none ${activeWork === index
                ? "opacity-35 scale-100"
                : "opacity-0 scale-105"
                }`}
            >

              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover filter blur-[2px]"
              />

            </div>

          ))}

          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">

            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">

              {/* LEFT CONTENT */}
              <div className="lg:col-span-5">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-3 backdrop-blur-md">
                  Our Capabilities
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">
                  Explore Our
                  <br />
                  <span className="text-indigo-400">
                    Metal Work
                  </span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4">
                  {workShowcase[activeWork].description}
                </p>

                <div className="mt-6 p-5 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-md shadow-xl">

                  <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
                    {workShowcase[activeWork].highlight}
                  </span>

                  <h4 className="text-white text-xl font-bold mt-1">
                    {workShowcase[activeWork].title}
                  </h4>

                </div>

                <div className="mt-7">

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-indigo-600/30"
                  >
                    View Products Catalog →
                  </Link>

                </div>

              </div>

              {/* RIGHT GRID */}
              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">

                {visibleGridItems.map((item) => {

                  const isActive =
                    activeWork === item.originalIndex;

                  return (

                    <div
                      key={item.id}
                      onClick={() =>
                        setActiveWork(item.originalIndex)
                      }
                      className={`cursor-pointer group relative h-56 sm:h-64 rounded-2xl overflow-hidden border transition-all duration-500 bg-slate-900/80 ${isActive
                        ? "border-indigo-500 shadow-2xl shadow-indigo-950/80 scale-[1.02] ring-2 ring-indigo-500/50"
                        : "border-white/15 hover:border-white/40 opacity-75 hover:opacity-100"
                        }`}
                    >

                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3">

                        <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                          {item.category}
                        </p>

                        <h3 className="text-white text-base font-bold mt-0.5">
                          {item.title}
                        </h3>

                      </div>

                    </div>

                  );
                })}

              </div>

            </div>

          </div>

        </section>
      </Reveal>


      {/* =========================================================
          HOW WE WORK
      ========================================================= */}
      <Reveal>
        <section className="bg-white pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

            <SectionHeading
              label="How We Work"
              title={
                <>
                  Simple Process,
                  <span className="text-indigo-600">
                    {" "}Reliable Execution
                  </span>
                </>
              }
              text="From understanding your requirement to completing the finished product, we keep the process simple and practical."
            />

            <div className="grid md:grid-cols-3 gap-4 sm:gap-5">

              {process.map(([number, title, text, icon]) => (

                <div
                  key={number}
                  className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                >

                  <div className="flex justify-between">

                    <span className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                      {number}
                    </span>

                    <span className="text-slate-300 group-hover:text-indigo-300 text-2xl font-black">
                      {icon}
                    </span>

                  </div>

                  <h3 className="text-lg font-bold mt-6">
                    {title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-6 mt-3">
                    {text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>
      </Reveal>


      {/* =========================================================
          CTA
      ========================================================= */}
      <Reveal>
        <section className="bg-[#0f172b] py-12 sm:py-14 text-center text-white">

          <div className="max-w-3xl mx-auto px-4">

            <span className="text-[#7C86FF] text-[10px] font-bold uppercase tracking-[0.3em]">
              Start Your Requirement
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mt-2">
              Need Custom{" "}
              <span className="text-[#7C86FF]">
                Metal Work?
              </span>
            </h2>

            <p className="text-slate-300 max-w-md mx-auto mt-3 text-xs md:text-sm leading-relaxed">
              Tell us your required size, material, quantity or application.
              We can discuss your requirement and options.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">

              <Link
                to="/contact"
                className="bg-[#4F39F6] hover:bg-[#5D49F7] px-6 py-3 rounded-xl font-bold text-xs transition"
              >
                Request a Quote →
              </Link>

              <Link
                to="/products"
                className="border border-[#33415f] hover:border-[#4F39F6] px-6 py-3 rounded-xl font-bold text-xs transition"
              >
                Browse Products
              </Link>

            </div>

          </div>

        </section>
      </Reveal>

    </div>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */
function SectionHeading({ label, title, text }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">

      <span className="text-indigo-600 text-base sm:text-lg font-bold uppercase tracking-[0.25em]">
        {label}
      </span>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-4 leading-tight">
        {title}
      </h2>

      <p className="text-slate-500 text-sm md:text-base mt-5 leading-7 max-w-2xl mx-auto">
        {text}
      </p>

    </div>
  );
}

export default Home;