const SuccessModal = ({ isOpen, onClose, employee: product }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-6">
                
                <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                    Brabd Added!
                </h2>

                <p className="text-gray-600 mb-4">The new Brand has been successfully added to your inventory.</p>

                <div className="bg-gray-50 rounded-lg p-4 my-4 text-left">
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                            {product.image ? (
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 18" /></svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
                            {/*<p className="text-sm text-gray-500">Price: <span className="font-semibold">${parseFloat(product.selling_price).toFixed(2)}</span></p>*/}
                            {/*<p className="text-sm text-gray-500">Stock: <span className="font-semibold">{product.stock} units</span></p>*/}
                        </div>
                    </div>
                </div>

                <button
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={onClose}
                >
                    Great, thanks!
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
