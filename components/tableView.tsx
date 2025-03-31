'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useParams, useRouter } from "next/navigation";

export default function TableView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Dynamic ID from the route

  const handleClick = () => {
    router.push('/management')
  }
  
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <header className="flex items-center justify-between w-full p-4 bg-white shadow-md">
        <ArrowLeftIcon onClick={() => handleClick()} className="w-6 h-6" />
      </header>
      <main className="flex flex-col items-center w-full p-4 space-y-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <CardTitle className="text-lg font-semibold">Table #0001</CardTitle>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-400">01</div>
          </CardHeader>
          <CardContent className="mt-4" />
        </Card>
        <div className="w-full max-w-md space-y-2">
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>LT</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Name: Larissa T.</p>
                <p className="text-sm text-muted-foreground">Tab: #00124</p>
              </div>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-muted-foreground" />
          </Card>
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>LE</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Name: Lucas Eduardo</p>
                <p className="text-sm text-muted-foreground">Tab: #00471</p>
              </div>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-muted-foreground" />
          </Card>
          <Card className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback>VO</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Name: Vitor Oliveira</p>
                <p className="text-sm text-muted-foreground">Tab: #00147</p>
              </div>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-muted-foreground" />
          </Card>
        </div>
      </main>
      <footer className="w-full p-4 text-center text-sm text-muted-foreground">Todos os direitos reservados.</footer>
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


function ChevronRightIcon(props: any) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}