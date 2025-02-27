import clsx from 'clsx';

export default function SideBar() {
  return (
    <div
      className={clsx(
        'w-48 ml-4 pl-8 py-8 bg-black/30',
        'absolute top-1/2 -translate-y-1/2',
        'flex flex-col gap-4'
      )}
    >
      <div className="text-white">
        <h2 className="text-2xl my-1">Men</h2>
        <ul>
          <li>menu 1</li>
          <li>menu 2</li>
          <li>menu 3</li>
          <li>menu 4</li>
        </ul>
      </div>
      <div className="text-white">
        <h2 className="text-2xl my-1">Woman</h2>
        <ul>
          <li>menu 1</li>
          <li>menu 2</li>
          <li>menu 3</li>
          <li>menu 4</li>
        </ul>
      </div>
    </div>
  );
}
