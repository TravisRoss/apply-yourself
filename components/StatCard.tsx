import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

type StatCardProps = {
  title: string
  value: string
  footerText: string
}

export default function StatCard({ title, value, footerText }: StatCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{value}</p>
      </CardContent>
      <CardFooter>
        <p>{footerText}</p>
      </CardFooter>
    </Card>
  )
}
