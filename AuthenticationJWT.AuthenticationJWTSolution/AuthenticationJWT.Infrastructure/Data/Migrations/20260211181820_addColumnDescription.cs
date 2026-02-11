using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthenticationJWT.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class addColumnDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ChatRooms",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "ChatRooms");
        }
    }
}
