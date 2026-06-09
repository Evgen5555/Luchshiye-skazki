import { StoryViewer } from "@/components/StoryViewer";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <StoryViewer storyId={id} />
    </div>
  );
}
