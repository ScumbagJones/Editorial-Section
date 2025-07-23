import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink } from "lucide-react";

const archiveIssues = [
  {
    id: 14,
    title: "Imagining Tomorrow",
    subtitle: "Q-zine 10th Anniversary Edition",
    status: "Current Issue",
    isCurrent: true,
  },
  {
    id: 13,
    title: "Community Voices",
    subtitle: "Summer 2024 Edition",
    status: "Archive",
    isCurrent: false,
  },
  {
    id: 12,
    title: "Creative Collective",
    subtitle: "Spring 2024 Edition",
    status: "Archive",
    isCurrent: false,
  },
];

export default function ArchiveSection() {
  const openIssue = () => {
    window.open('https://issuu.com/your-magazine', '_blank');
  };

  return (
    <section id="archive" className="py-16 bg-gradient-to-br from-[var(--charcoal)] to-[var(--navy)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Archive</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of past issues and community showcases
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {archiveIssues.map((issue) => (
            <Card 
              key={issue.id}
              className="bg-gradient-to-br from-[var(--light-grey)] to-[var(--slate)] border-border hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={openIssue}
            >
              <CardHeader className="pb-4">
                <div className="h-48 bg-gradient-to-br from-[var(--muted)] to-[var(--slate)] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground font-medium">Issue #{issue.id}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl text-white mb-2">
                  {issue.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm mb-4">
                  {issue.subtitle}
                </p>
                <div className="flex items-center justify-between">
                  <Badge 
                    className={issue.isCurrent ? "text-editorial bg-editorial/20" : "text-muted-foreground bg-muted/20"}
                  >
                    {issue.status}
                  </Badge>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
