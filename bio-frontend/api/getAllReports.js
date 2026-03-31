const getAllReports = async () => {
    try {
        const res = await fetch("http://localhost:3001/publications/allAsReports", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!res.ok) throw new Error("Failed to fetch reports");

        return res.json()

    } catch (error) {
        console.log(error)
    }
}

export default getAllReports;