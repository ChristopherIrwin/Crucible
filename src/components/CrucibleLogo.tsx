export function CrucibleLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L7 9H3L6.5 15.5L4 22H12H20L17.5 15.5L21 9H17L12 2Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M9.5 14L12 10.5L14.5 14L12 17.5L9.5 14Z"
        fill="black"
        fillOpacity="0.35"
      />
    </svg>
  )
}
