/**
 * v0 by Vercel.
 * @see https://v0.dev/t/7ytHZDMmgIy
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TabMenu() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white p-4">
      <main className="flex flex-col gap-4 p-4">
        <div className="h-full lg:flex flex-col items-center justify-center">
        <Card className="w-full max-w-md h-full">
          <CardHeader className="flex items-center gap-4">
            <ClipboardIcon className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg font-bold text-primary">Tab</CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">#00147</CardDescription>
              <p className="text-sm text-muted-foreground">Vitor Oliveira de V. Silva</p>
            </div>
          </CardHeader>
        </Card>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cerveja 1 Litro - Skol</p>
              <p className="text-xs text-muted-foreground">
                Qtd. <span className="text-primary">4</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">R$ 32,00</p>
              <button className="flex items-center justify-center w-6 h-6">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cachaça 51 - Dose</p>
              <p className="text-xs text-muted-foreground">
                Qtd. <span className="text-primary">2</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">R$ 12,00</p>
              <button className="flex items-center justify-center w-6 h-6">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Bata Frita - Porção</p>
              <p className="text-xs text-muted-foreground">
                Qtd. <span className="text-primary">1</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">R$ 17,00</p>
              <button className="flex items-center justify-center w-6 h-6">
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t my-4" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">Subtotal</p>
            <p className="text-sm font-medium">R$ 61,00</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Tip</p>
            <p className="text-sm font-medium">R$ 6,10</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">Total</p>
            <p className="text-sm font-medium">R$ 67,10</p>
          </div>
        </div>
      </main>
      <footer className="p-4">
        <Button className="w-full bg-[#5f0f40] text-white py-2">Fechar Comanda</Button>
      </footer>
    </div>
  )
}

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}


function ClipboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}


function EllipsisVerticalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}


function MartiniIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 22h8" />
      <path d="M12 11v11" />
      <path d="m19 3-7 8-7-8Z" />
    </svg>
  )
}