module.exports = async function (context, req) {

    context.log("Appointment booking request received");

    try {

        const appointment = req.body;

        // Request body validation
        if (!appointment) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message: "Request body is required"
                }
            };
            return;
        }

        const {
            hospitalId,
            doctorId,
            doctorName,
            patientId,
            patientName,
            appointmentDate,
            appointmentTime
        } = appointment;

        // Required fields validation
        if (
            !hospitalId ||
            !doctorId ||
            !doctorName ||
            !patientId ||
            !patientName ||
            !appointmentDate ||
            !appointmentTime
        ) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message:
                        "hospitalId, doctorId, doctorName, patientId, patientName, appointmentDate and appointmentTime are required"
                }
            };
            return;
        }

        // Create appointment document
        const appointmentDocument = {

            // Unique ID
            id: `appointment-${Date.now()}`,

            // Used to identify document type
            type: "appointment",

            // REQUIRED because doctors container uses /hospitalId
            hospitalId: hospitalId.trim(),

            doctorId: doctorId.trim(),
            doctorName: doctorName.trim(),

            patientId: patientId.trim(),
            patientName: patientName.trim(),

            appointmentDate: appointmentDate.trim(),
            appointmentTime: appointmentTime.trim(),

            status: "booked",

            createdAt: new Date().toISOString()
        };

        // Save appointment inside doctors container
        context.bindings.appointmentDocument = appointmentDocument;

        context.res = {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                success: true,
                message: "Appointment booked successfully",
                appointment: appointmentDocument
            }
        };

    } catch (error) {

        context.log.error(
            "Appointment booking error:",
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