import logoAsset from "@/assets/novaluna-logo.png.asset.json";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return <img src={logoAsset.url} alt="Novaluna Bank logo" className={className} />;
}
