export default function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative 
        inline-flex
        h-5
        w-9
        shrink-0
        items-center
        rounded-full
        transition-colors
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#99c066]
        focus-visible:ring-offset-2 
        ${checked ? "bg-[#99c066]" : "bg-[#d6d3d1]"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}