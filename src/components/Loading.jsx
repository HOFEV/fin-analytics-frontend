export default function Loading({ text = 'Загрузка данных...' }) {
    return (
        <div className="state state--loading">
            {text}
        </div>
    )
}