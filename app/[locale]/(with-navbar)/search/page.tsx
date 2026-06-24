import { getTranslations } from "next-intl/server";

export default async function SearchPage() {
  const t = await getTranslations("search");

  return (
    <div>
      <div>{t("page_message")}</div>
    </div>
  );
}
