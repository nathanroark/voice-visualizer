import { usePositionQuery } from "../libs/queries";

export const EntityList = () => {
  const { data: positions } = usePositionQuery();

  if (!positions) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl underline">Positions from WebSocket</h2>
      {positions.length === 0 ? (
        <p className="overflow-y-auto w-[400px] h-[calc(100vh-200px)]">
          No entities yet...
        </p>
      ) : (
        <ul className="overflow-y-auto w-[600px] h-[calc(100vh-200px)]">
          {positions
            .map((pos) => (
              <li key={pos.id}>
                <code>{JSON.stringify(pos.coordianates, null, 2)}</code>
              </li>
            ))
            .reverse()}
        </ul>
      )}
    </div>
  );
};
