import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ProductSpecifications = ({ product }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    if (product) {
      setAttributes(product.attributes || []);
    }
    return () => clearTimeout(timer);
  }, [product]);

  if (!product) {
    return (
      <div className="w-full bg-white font-rajdhani flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">
          Loading specifications...
        </div>
      </div>
    );
  }

  const defaultSpecs = {
    warranty: {
      info: "1 Year Onsite Warranty",
      options: ["1", "2", "3"],
    },
    specifications: {
      processor: "INTEL Core - i7 14700K 4.3GHz Unlocked",
      graphics: "NVIDIA RTX 4070 Ti Super 16GB",
      motherboard: "Asus PRIME Z790 Creator WiFi 6E",
      ram: "64KILL Dual Channel Memory",
      storage: "SAMSUNG 980 Pro",
      cooling: "AIR COOLED NOCTUA D14X",
      case: "GOOD ESPORTS ZR069",
      psu: "CORSAIR RM 1000e - 80+ GOLD",
      os: "MICROSOFT Windows 11 Home",
    },
    connectivity: {
      motherboard: [
        "2x DisplayPort input for Thunderbolt 4",
        "1x HDMI",
        "2x Thunderbolt 4 Compatible USB 4 Compliant",
        "10Gb and 2.5Gb Ethernet",
        "6x USB 3.2 Gen 2",
        "WiFi 6E",
        "1x BIOS Flashback Button",
        "5x Audio Jacks",
      ],
      graphics: ["1x HDMI 2.1a", "3x DisplayPort 1.4a"],
      case: ["1x USB 3.0", "2x USB 2.0", "2x Audio Jacks"],
    },
    dimensions: {
      case: "335x216x455mm",
      weight: "7.0KG",
      powerConsumption: ["400W Nominal", "800W PEAK"],
      audio: "REALTEK (R) Audio",
    },
  };

  const specs = {
    warranty: {
      info: product.warranty_info || defaultSpecs.warranty.info,
      options: product.warrantyOptions || defaultSpecs.warranty.options,
    },
    specifications: {
      processor: product.processor || defaultSpecs.specifications.processor,
      graphics: product.graphics || defaultSpecs.specifications.graphics,
      motherboard:
        product.motherboard || defaultSpecs.specifications.motherboard,
      ram: product.ram || defaultSpecs.specifications.ram,
      storage: product.storage || defaultSpecs.specifications.storage,
      cooling: product.cooling || defaultSpecs.specifications.cooling,
      case: product.case || defaultSpecs.specifications.case,
      psu: product.psu || defaultSpecs.specifications.psu,
      os: product.os || defaultSpecs.specifications.os,
    },
    connectivity: product.connectivity || defaultSpecs.connectivity,
    dimensions: product.dimensions || defaultSpecs.dimensions,
    whatsinside: product.whats_inside

  };

  return (
    <div
      className={`w-full bg-white font-rajdhani ${
        isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } transition-all duration-500 ease-in-out`}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-8">

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="text-xl  uppercase font-semibold">
            WHAT'S INSIDE
          </div>
          <div>
            <p className="text-gray-800">{specs.whatsinside}</p>
          </div>
          <div></div>
          {/* <p className="mb-2">AMC Bundles Available at Checkout (Years)</p> */}
          {/* <div className="flex gap-2">
            {specs.warranty.options.map((option, index) => (
              <div key={index} className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                {option}
              </div>
            ))}
          </div> */}
        </div>
        {/* OVERVIEW SECTION */}
        <h1 className="text-xl font-semibold uppercase mb-6">OVERVIEW</h1>

        {/* WARRANTY INFO */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="font-medium text-gray-700 font-semibold">
            WARRANTY INFO
          </div>
          <div>
            <p className="text-gray-800">{specs.warranty.info}</p>
          </div>
          <div></div>
          {/* <p className="mb-2">AMC Bundles Available at Checkout (Years)</p> */}
          {/* <div className="flex gap-2">
            {specs.warranty.options.map((option, index) => (
              <div key={index} className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                {option}
              </div>
            ))}
          </div> */}
        </div>

        <div className="h-px bg-gray-200 my-6"></div>

        {/* SPECIFICATIONS */}
        <div className="mb-8">
          <div className="space-y-2 text-sm">
            {(() => {
              const sortedAttributes = [...attributes].sort((a, b) =>
                a.attribute.category.name.localeCompare(
                  b.attribute.category.name
                )
              );

              let previousCategory = "";

              return sortedAttributes.map((attr, index) => {
                const currentCategory = attr.attribute.category.name;
                const showCategory = currentCategory !== previousCategory;
                previousCategory = currentCategory;

                return (
                  <div key={index} className="grid grid-cols-3 gap-4">
                    {/* Category */}
                    <div className="font-medium text-gray-700 font-semibold">
                      {showCategory ? currentCategory : ""}
                    </div>

                    {/* Attribute Name */}
                    <div className="text-gray-800">{attr.attribute.name}</div>

                    {/* Attribute Values */}
                    <div className="text-gray-600">
                      {attr.details?.length === 1 ? (
                        <span>{attr.details[0].value}</span>
                      ) : (
                        <div className="flex flex-col space-y-1">
                          {attr.details.map((detail, detailIndex) => (
                            <span key={detailIndex}>{detail.value}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="h-px bg-gray-200 my-6"></div>
      </div>
    </div>
  );
};

ProductSpecifications.propTypes = {
  product: PropTypes.shape({
    warrantyInfo: PropTypes.string,
    warrantyOptions: PropTypes.arrayOf(PropTypes.string),
    processor: PropTypes.string,
    graphics: PropTypes.string,
    motherboard: PropTypes.string,
    ram: PropTypes.string,
    storage: PropTypes.string,
    cooling: PropTypes.string,
    case: PropTypes.string,
    psu: PropTypes.string,
    os: PropTypes.string,
    connectivity: PropTypes.shape({
      motherboard: PropTypes.arrayOf(PropTypes.string),
      graphics: PropTypes.arrayOf(PropTypes.string),
      case: PropTypes.arrayOf(PropTypes.string),
    }),
    dimensions: PropTypes.shape({
      case: PropTypes.string,
      weight: PropTypes.string,
      powerConsumption: PropTypes.arrayOf(PropTypes.string),
      audio: PropTypes.string,
    }),
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        attribute: PropTypes.shape({
          name: PropTypes.string,
          category: PropTypes.shape({
            name: PropTypes.string,
          }),
        }),
        details: PropTypes.arrayOf(
          PropTypes.shape({
            value: PropTypes.string,
          })
        ),
      })
    ),
  }),
};

ProductSpecifications.defaultProps = {
  product: null,
};

export default ProductSpecifications;
