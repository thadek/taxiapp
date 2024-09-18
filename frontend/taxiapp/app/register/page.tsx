export default function register() {
    return (
        <div>
            <div className="">
                <a href="/">Volver</a>
            </div>
            <div className="flex items-center justify-center h-screen">
                <form className="flex flex-col gap-4">
                    <h1>Registro</h1>
                    <label className="flex flex-col">
                        Nombre:
                        <input
                            type="text"
                            name="name"
                            className="border rounded p-2 mt-1"
                        />
                    </label>
                    <label className="flex flex-col">
                        Apellido:
                        <input
                            type="text"
                            name="lastname"
                            className="border rounded p-2 mt-1"
                        />
                    </label>
                    <label className="flex flex-col">
                        Email:
                        <input
                            type="email"
                            name="email"
                            className="border rounded p-2 mt-1"
                        />
                    </label>
                    <label className="flex flex-col">
                        Usuario:
                        <input
                            type="text"
                            name="username"
                            className="border rounded p-2 mt-1"
                        />
                    </label>
                    <label className="flex flex-col">
                        Contraseña:
                        <input
                            type="password"
                            name="password"
                            className="border rounded p-2 mt-1"
                        />
                    </label>
                    <label className="flex flex-col">
                        Confirmar Contraseña:
                        <input
                            type="password"
                            name="password"
                            className="border rounded p-2 mt-1"
                        />
                    </label>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    )
}