import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Link as LinkIcon,
  Users,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

// This would come from your database
const metrics = [
  {
    title: "Total Links",
    value: "12",
    change: "+2",
    changeLabel: "from last month",
    icon: LinkIcon,
    trend: "up",
  },
  {
    title: "Total Views",
    value: "2,350",
    change: "+180",
    changeLabel: "from last month",
    icon: Activity,
    trend: "up",
  },
  {
    title: "Active Modules",
    value: "8",
    change: "+1",
    changeLabel: "from last month",
    icon: Briefcase,
    trend: "up",
  },
  {
    title: "Team Members",
    value: "6",
    change: "-1",
    changeLabel: "from last month",
    icon: Users,
    trend: "down",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "link_created",
    title: "New Link Created",
    description: "Luxury Suite Booking link was created",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "service_updated",
    title: "Service Updated",
    description: "Room Service Menu was updated",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "milestone",
    title: "Milestone Reached",
    description: "Spa Treatment link reached 500 views",
    timestamp: "1 day ago",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch hotel data
  const { data: hotels, error: hotelsError } = await supabase
    .from('hotels')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (hotelsError) {
    console.error('Error fetching hotels:', hotelsError);
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">Welcome back, {user.email?.split("@")[0]}</h1>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your hotel services today.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="overflow-hidden backdrop-blur-sm bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-semibold tracking-tight">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={metric.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="backdrop-blur-sm bg-card/50">
        <CardHeader className="border-b p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentActivity.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-center justify-between p-6",
                index !== recentActivity.length - 1 && "border-b"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  {activity.type === "link_created" && <Plus className="h-4 w-4 text-primary" />}
                  {activity.type === "service_updated" && <Briefcase className="h-4 w-4 text-primary" />}
                  {activity.type === "milestone" && <Activity className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {activity.timestamp}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hotel Data JSON */}
      <Card className="backdrop-blur-sm bg-card/50">
        <CardHeader className="border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-medium">Hotel Data</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <pre className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
            {JSON.stringify(hotels, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
} 