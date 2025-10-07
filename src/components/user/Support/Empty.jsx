import React from 'react'

function Empty() {
  return (
    <div>
        <div className="min-h-screen mt-8 bg-gradient-to-r from-white to-emerald-500 flex justify-center items-center p-5 w-[90vw] mx-auto mt-[10%] rounded-3xl box-border">
            <div className="w-full max-w-[80vw] flex flex-col gap-5">
            <div className="w-full rounded-lg overflow-hidden">
                <div className="flex flex-wrap p-5 gap-px items-center">
                <div className="flex-1">
                    <h2 className="text-4xl m-0 font-sans">Support</h2>
                </div>
                </div>
                <div className="h-[9px] rounded bg-black mx-0 my-2.5"></div>
                <div className="flex flex-col gap-5 p-5">
                <div className="flex flex-wrap gap-5 justify-between">
                    <div className="flex-1 min-w-[300px] p-5 rounded-lg bg-white shadow-md border-3 border-black">
                    <h2 className="text-2xl mt-2.5 mb-2.5">Customer Support</h2>
                    <h3 className="text-xl mt-2.5 mb-2.5">How can we help you?</h3>
                    <ul className="list-none my-1.5 p-0">
                        <li className="my-2">✓ 24/7 Technical Support</li>
                        <li className="my-2">✓ Product Information</li>
                        <li className="my-2">✓ Order Status & Tracking</li>
                        <li className="my-2">✓ Returns & Exchanges</li>
                        <li className="my-2">✓ Warranty & Repairs</li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Empty
