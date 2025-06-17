import MainImageSlider from '@/components/main-image-slider';

export default function Home() {
  return (
    <div className="w-full">
      <MainImageSlider />
      <div>
        <h2 className="my-4 text-2xl font-bold">new</h2>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-violet-500 w-full h-56 rounded-lg">
              ,
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
