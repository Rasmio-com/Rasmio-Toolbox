"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";
import { copyText } from "@/lib/utils";

type Emoji = { e: string; name: string };

const GROUPS: { title: string; items: Emoji[] }[] = [
  {
    title: "چهره‌ها و احساسات",
    items: [
      { e: "😀", name: "خنده grinning" }, { e: "😃", name: "خوشحال smiley" },
      { e: "😄", name: "شاد laughing" }, { e: "😁", name: "نیشخند beaming" },
      { e: "😆", name: "قهقهه" }, { e: "😅", name: "خنده عرق sweat smile" },
      { e: "🤣", name: "رول خنده rofl" }, { e: "😂", name: "اشک خنده joy" },
      { e: "🙂", name: "لبخند slight smile" }, { e: "😉", name: "چشمک wink" },
      { e: "😊", name: "گونه blush" }, { e: "😍", name: "عاشق heart eyes" },
      { e: "🥰", name: "قلب‌ها smiling hearts" }, { e: "😘", name: "بوس kiss" },
      { e: "😎", name: "عینک sunglasses cool" }, { e: "🤩", name: "ستاره star struck" },
      { e: "🤔", name: "فکر thinking" }, { e: "🤨", name: "ابرو raised eyebrow" },
      { e: "😐", name: "بی‌حالت neutral" }, { e: "😶", name: "بی‌دهان no mouth" },
      { e: "🙄", name: "چشم‌چرخان eye roll" }, { e: "😏", name: "پوزخند smirk" },
      { e: "😴", name: "خواب sleeping" }, { e: "😪", name: "خواب‌آلود sleepy" },
      { e: "😜", name: "زبان tongue wink" }, { e: "🤪", name: "دیوانه zany" },
      { e: "😋", name: "خوشمزه yum" }, { e: "🤗", name: "بغل hug" },
      { e: "🤫", name: "هیس shush" }, { e: "🤐", name: "زیپ دهان zipper" },
      { e: "😬", name: "گریماس grimace" }, { e: "😳", name: "سرخ flushed" },
      { e: "🥺", name: "التماس pleading" }, { e: "😢", name: "گریه cry" },
      { e: "😭", name: "زار loudly cry" }, { e: "😤", name: "فوت triumph" },
      { e: "😠", name: "عصبانی angry" }, { e: "😡", name: "خشم pouting" },
      { e: "🤯", name: "انفجار مغز mind blown" }, { e: "😱", name: "جیغ scream" },
      { e: "😨", name: "ترس fearful" }, { e: "😰", name: "اضطراب anxious" },
      { e: "🤕", name: "زخم head bandage" }, { e: "🤒", name: "بیمار sick" },
      { e: "🤮", name: "استفراغ vomit" }, { e: "🥳", name: "جشن partying" },
      { e: "😇", name: "فرشته angel" }, { e: "🤝", name: "دست‌دادن handshake" },
    ],
  },
  {
    title: "حرکات و افراد",
    items: [
      { e: "👍", name: "لایک thumbs up" }, { e: "👎", name: "دیسلایک thumbs down" },
      { e: "👌", name: "اوکی ok" }, { e: "✌️", name: "پیروزی victory" },
      { e: "🤞", name: "انگشت قلاب crossed fingers" }, { e: "🤟", name: "دوستت دارم love you" },
      { e: "🤘", name: "راک rock" }, { e: "👏", name: "تشویق clap" },
      { e: "🙌", name: "هورا raised hands" }, { e: "🙏", name: "دعا pray" },
      { e: "👋", name: "سلام wave" }, { e: "💪", name: "بازو muscle" },
      { e: "✍️", name: "نوشتن writing" }, { e: "👀", name: "چشم‌ها eyes" },
      { e: "🧠", name: "مغز brain" }, { e: "❤️", name: "قلب قرمز red heart" },
      { e: "🧡", name: "قلب نارنجی orange heart" }, { e: "💛", name: "قلب زرد yellow heart" },
      { e: "💚", name: "قلب سبز green heart" }, { e: "💙", name: "قلب آبی blue heart" },
      { e: "💜", name: "قلب بنفش purple heart" }, { e: "🖤", name: "قلب مشکی black heart" },
      { e: "💔", name: "قلب شکسته broken heart" }, { e: "💕", name: "دو قلب two hearts" },
      { e: "🔥", name: "آتش fire" }, { e: "✨", name: "برق sparkles" },
      { e: "⭐", name: "ستاره star" }, { e: "🌟", name: "ستاره درخشان glowing star" },
      { e: "💯", name: "صد hundred" }, { e: "💥", name: "انفجار collision" },
    ],
  },
  {
    title: "حیوانات و طبیعت",
    items: [
      { e: "🐶", name: "سگ dog" }, { e: "🐱", name: "گربه cat" },
      { e: "🦊", name: "روباه fox" }, { e: "🐻", name: "خرس bear" },
      { e: "🐼", name: "پاندا panda" }, { e: "🐨", name: "کوآلا koala" },
      { e: "🦁", name: "شیر lion" }, { e: "🐯", name: "ببر tiger" },
      { e: "🐮", name: "گاو cow" }, { e: "🐷", name: "خوک pig" },
      { e: "🐵", name: "میمون monkey" }, { e: "🐔", name: "مرغ chicken" },
      { e: "🐧", name: "پنگوئن penguin" }, { e: "🐦", name: "پرنده bird" },
      { e: "🦄", name: "اسب شاخدار unicorn" }, { e: "🐝", name: "زنبور bee" },
      { e: "🦋", name: "پروانه butterfly" }, { e: "🐢", name: "لاک‌پشت turtle" },
      { e: "🐍", name: "مار snake" }, { e: "🐙", name: "اختاپوس octopus" },
      { e: "🐠", name: "ماهی fish" }, { e: "🐳", name: "نهنگ whale" },
      { e: "🌵", name: "کاکتوس cactus" }, { e: "🌲", name: "درخت tree" },
      { e: "🌴", name: "نخل palm" }, { e: "🌷", name: "لاله tulip" },
      { e: "🌹", name: "رز rose" }, { e: "🌻", name: "آفتابگردان sunflower" },
      { e: "🍀", name: "شبدر clover" }, { e: "🌙", name: "ماه moon" },
      { e: "☀️", name: "خورشید sun" }, { e: "⛅", name: "ابر cloud" },
      { e: "🌈", name: "رنگین‌کمان rainbow" }, { e: "❄️", name: "برف snowflake" },
      { e: "💧", name: "قطره droplet" }, { e: "🌊", name: "موج wave" },
    ],
  },
  {
    title: "غذا و نوشیدنی",
    items: [
      { e: "🍎", name: "سیب apple" }, { e: "🍌", name: "موز banana" },
      { e: "🍇", name: "انگور grapes" }, { e: "🍓", name: "توت‌فرنگی strawberry" },
      { e: "🍉", name: "هندوانه watermelon" }, { e: "🍊", name: "پرتقال orange" },
      { e: "🍋", name: "لیمو lemon" }, { e: "🍒", name: "گیلاس cherry" },
      { e: "🥑", name: "آووکادو avocado" }, { e: "🍅", name: "گوجه tomato" },
      { e: "🌶️", name: "فلفل pepper" }, { e: "🌽", name: "ذرت corn" },
      { e: "🍔", name: "همبرگر burger" }, { e: "🍕", name: "پیتزا pizza" },
      { e: "🌭", name: "هات‌داگ hotdog" }, { e: "🍟", name: "سیب‌زمینی fries" },
      { e: "🌮", name: "تاکو taco" }, { e: "🍜", name: "نودل noodles" },
      { e: "🍣", name: "سوشی sushi" }, { e: "🍞", name: "نان bread" },
      { e: "🧀", name: "پنیر cheese" }, { e: "🍳", name: "تخم‌مرغ egg" },
      { e: "🍩", name: "دونات donut" }, { e: "🍪", name: "کوکی cookie" },
      { e: "🎂", name: "کیک cake" }, { e: "🍫", name: "شکلات chocolate" },
      { e: "🍿", name: "پاپ‌کورن popcorn" }, { e: "☕", name: "قهوه coffee" },
      { e: "🍵", name: "چای tea" }, { e: "🥤", name: "نوشابه drink" },
      { e: "🍺", name: "آبجو beer" }, { e: "🍷", name: "شراب wine" },
    ],
  },
  {
    title: "اشیا و نمادها",
    items: [
      { e: "💻", name: "لپ‌تاپ laptop" }, { e: "🖥️", name: "کامپیوتر desktop" },
      { e: "⌨️", name: "کیبورد keyboard" }, { e: "🖱️", name: "ماوس mouse" },
      { e: "📱", name: "موبایل phone" }, { e: "🔋", name: "باتری battery" },
      { e: "💡", name: "لامپ bulb" }, { e: "🔌", name: "پریز plug" },
      { e: "📷", name: "دوربین camera" }, { e: "🎥", name: "فیلم movie" },
      { e: "🎧", name: "هدفون headphone" }, { e: "🎮", name: "گیم game" },
      { e: "📦", name: "بسته package" }, { e: "📁", name: "پوشه folder" },
      { e: "📄", name: "سند document" }, { e: "📌", name: "سنجاق pushpin" },
      { e: "📎", name: "گیره paperclip" }, { e: "✂️", name: "قیچی scissors" },
      { e: "🔑", name: "کلید key" }, { e: "🔒", name: "قفل lock" },
      { e: "🔓", name: "قفل باز unlock" }, { e: "🔔", name: "زنگ bell" },
      { e: "⏰", name: "ساعت alarm" }, { e: "⏳", name: "شن hourglass" },
      { e: "💰", name: "پول money" }, { e: "💳", name: "کارت card" },
      { e: "🎁", name: "هدیه gift" }, { e: "🎉", name: "جشن party" },
      { e: "🚀", name: "موشک rocket" }, { e: "✈️", name: "هواپیما plane" },
      { e: "🚗", name: "ماشین car" }, { e: "🏠", name: "خانه house" },
      { e: "✅", name: "تیک check" }, { e: "❌", name: "ضربدر cross" },
      { e: "⚠️", name: "هشدار warning" }, { e: "❓", name: "سؤال question" },
      { e: "❗", name: "تعجب exclamation" }, { e: "➡️", name: "فلش راست arrow" },
      { e: "🔗", name: "لینک link" }, { e: "🔍", name: "ذره‌بین search" },
    ],
  },
];

export default function EmojiPickerTool() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return GROUPS;
    return GROUPS.map((g) => ({
      title: g.title,
      items: g.items.filter((i) => i.name.toLowerCase().includes(t) || i.e === q.trim()),
    })).filter((g) => g.items.length > 0);
  }, [q]);

  async function copy(e: string) {
    if (await copyText(e)) {
      setCopied(e);
      setTimeout(() => setCopied(""), 1200);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو" hint="بر اساس نام فارسی یا انگلیسی">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="قلب  یا  fire" />
      </Field>
      <div className="space-y-5">
        {filtered.map((g) => (
          <div key={g.title} className="space-y-2">
            <h3 className="text-xs font-semibold text-saffron">{g.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <button
                  key={i.e}
                  type="button"
                  onClick={() => copy(i.e)}
                  title={i.name}
                  className="relative flex size-10 items-center justify-center rounded-lg border border-border bg-bg-soft text-xl transition-colors hover:border-turquoise-dim hover:bg-surface-3"
                >
                  {i.e}
                  {copied === i.e && (
                    <span className="absolute -top-6 rounded bg-turquoise px-1.5 py-0.5 text-[10px] font-semibold text-bg">کپی شد</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  );
}
