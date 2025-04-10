import { useTranslation } from "react-i18next";
import { ChangeEvent } from "react";

export default function About() {
  const { t, i18n } = useTranslation();

  const onclickLaguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
  };
  return (
    <div className="p-4">
      <p>{t("about.title")}</p>

      <div>
        <select onChange={onclickLaguageChange}>
          <option value="en">En</option>
          <option value="es">Es</option>
        </select>
      </div>
    </div>
  );
}
