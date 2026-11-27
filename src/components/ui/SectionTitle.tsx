import { cn } from '../../lib/utils';

export const SectionTitle = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => {
  return (
    <div className={cn("text-center mb-16", className)}>
      <h2 className="text-3xl md:text-5xl font-bold text-[#14231e] tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#687f74] text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
