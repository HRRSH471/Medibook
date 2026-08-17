module.exports = async function (context, req) {

    context.log("Fetching appointments from Cosmos DB");

    try {

        const appointments = context.bindings.appointments || [];

        context.res = {
            status: 200,

            headers: {
                "Content-Type": "application/json"
            },

            body: {
                success: true,
                count: appointments.length,
                appointments: appointments
            }
        };

    } catch (error) {

        context.log.error(
            "Error fetching appointments:",
            error
        );

        context.res = {
            status: 500,

            body: {
                success: false,
                message: "Internal server error"
            }
        };
    }
};