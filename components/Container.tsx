type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/** Page measure + consistent side margins. Everything aligns to this. */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-12 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
