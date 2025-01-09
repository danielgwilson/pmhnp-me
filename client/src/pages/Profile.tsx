import { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { mockTopics } from '@/data/topics';
import { getHistory } from '@/lib/storage';

export const Profile: FC = () => {
  const history = getHistory();
  const viewedTopics = mockTopics.filter(topic => history.includes(topic.id));

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <h2 className="text-lg font-medium mb-2">Recently Viewed</h2>
      <div className="space-y-4">
        {viewedTopics.map((topic) => (
          <Card key={topic.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={topic.imageUrl}
                  alt={topic.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-gray-600">{topic.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
