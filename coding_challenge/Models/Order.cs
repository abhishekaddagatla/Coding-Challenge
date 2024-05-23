namespace coding_challenge.Models;

public class Order {
    public Guid Id {get; set;}
    public OrderType Type {get; set;}
    public string? CustomerName {get; set;}
    public DateTime CreatedDate {get; set;}
    public string? CreatedByUsername {get; set;}

}