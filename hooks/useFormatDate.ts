const UseFormatDate = (iso: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  return (
    date.toLocaleDateString("th-TH") +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

export default UseFormatDate;
