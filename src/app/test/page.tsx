import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import TriageBadge from "@/components/ui/TriageBadge";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-papier p-12 flex flex-col gap-8 items-start">
      <h1 className="font-display text-4xl text-sauge">DermaLink</h1>
      <div className="flex gap-3">
        <Button>Primaire</Button>
        <Button variant="secondary">Secondaire</Button>
        <Button variant="ghost">Discret</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <Card className="w-80">
        <Input label="Email" placeholder="vous@exemple.com" />
      </Card>
      <div className="flex gap-6">
        <TriageBadge score={5} niveau="URGENT" />
        <TriageBadge score={2} niveau="MOYENNEMENT_URGENT" />
        <TriageBadge score={0} niveau="PAS_URGENT" />
      </div>
    </div>
  );
}