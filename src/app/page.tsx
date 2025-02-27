import MainImageSlider from '@/components/main-image-slider';
import SideBar from '@/components/side-bar';

export default function Home() {
  return (
    <div className="h-full overflow-hidden relative">
      <MainImageSlider />
      <SideBar />
    </div>
  );
}
