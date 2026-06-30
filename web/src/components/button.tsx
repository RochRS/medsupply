type EnterButtonProps = {
  buttonName: string;
  isDisabled: boolean;
  onClick: () => void;
};

export function EnterButton({
  buttonName,
  isDisabled,
  onClick,
}: EnterButtonProps) {
  return (
    <button onClick={onClick} disabled={isDisabled}>
      {buttonName}
    </button>
  );
}
