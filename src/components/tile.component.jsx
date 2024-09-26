import { TEXT_COLOR_CLASS_BY_VALUE, TILE_COLOR_CLASS_BY_VALUE } from "./tile.constant";

const Tile = ({ value }) => {
  return (
    <span
      style={{
        fontSize: value <= 64 ? 40 : value <= 512 ? 36 : 28
      }}
      className={`flex items-center justify-center w-24 h-24 rounded-md p-6 font-bold text-3xl ${TILE_COLOR_CLASS_BY_VALUE[value] || 'bg-slate-100'} ${TEXT_COLOR_CLASS_BY_VALUE[value] || 'text-slate-700'} drop-shadow-md`}
    >
      {value || ""}
    </span>
  );
};

export default Tile;
