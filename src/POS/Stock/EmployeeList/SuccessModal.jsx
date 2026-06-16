const SuccessModal = ({ isOpen, onClose, employee }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">

                <h2 className="text-xl font-semibold text-green-600 mb-3">
                    Employee Added Successfully!
                </h2>

                <p className="text-gray-700 mb-3">
                    <strong>Name:</strong> {employee.name} <br/>
                    <strong>Role:</strong> {employee.role}
                </p>

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
