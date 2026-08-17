module.exports = async function (context, req) {

    context.log("Fetching doctors from Cosmos DB");

    try {

        const doctors = context.bindings.doctors || [];

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                success: true,
                count: doctors.length,
                doctors: doctors
            }
        };

    } catch (error) {

        context.log.error("Error fetching doctors:", error);

        context.res = {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                success: false,
                message: "Failed to fetch doctors",
                error: error.message
            }
        };
    }
};