import { ThemeSwitcher } from "./theme-switcher"

export default function Footer() {
  return (
    <div>
        <footer className="w-full border-t">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between text-sm">
                <p>
                  South West France Product by{" "}
                  <a
                    href="https://example.com/"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Simon
                  </a>
                </p>
                <ThemeSwitcher />
              </div>
        </footer>
    </div>
  )
}
