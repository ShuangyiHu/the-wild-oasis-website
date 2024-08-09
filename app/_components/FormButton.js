import { useFormStatus } from "react-dom";
function FormButton({ children, loadingText }) {
  //this react-dom hook can only be used inside a compo that's rendered inside a form
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? loadingText : children}
    </button>
  );
}

export default FormButton;
