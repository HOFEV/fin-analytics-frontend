export default function ErrorMessage({ message }) {
    if (!message) {
        return null
    }

    return (
        <div className="state state--error">
            {message}
        </div>
    )
}