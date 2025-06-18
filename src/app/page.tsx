import MainImageSlider from '@/components/main-image-slider';
import SideBar from '@/components/side-bar';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from('clothes').select().limit(4);

  return (
    <div className="w-full h-full min-h-[calc(100vh-10rem)] grid grid-cols-[1fr_4fr_1fr]">
      <SideBar />
      <div className="w-full">
        <MainImageSlider />
        {data && data.length > 0 && (
          <div>
            <h2 className="my-4 text-2xl font-bold">new</h2>
            <div className="grid grid-cols-4 gap-4">
              {data.map((clothes) => (
                <div
                  key={clothes.id}
                  className="bg-violet-500 w-full h-56 rounded-lg"
                >
                  {clothes.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
